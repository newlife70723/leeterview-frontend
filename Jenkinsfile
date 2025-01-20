pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'leeterview'  // 自定义项目名称
    }

    stages {
        stage('Check Docker and Docker Compose') {
            steps {
                script {
                    // 检查 Docker 是否安装
                    sh 'which docker'
                    sh 'docker -v'
                    
                    // 检查 Docker Compose 是否安装
                    sh 'which docker-compose'
                    sh 'docker-compose -v'
                }
            }
        }

        stage('Check Directory Permissions') {
            steps {
                script {
                    // 确认 Jenkins 是否能列出 leeterview 目录中的文件
                    sh 'ls -la /home/ubuntu/leeterview'
                }
            }
        }

        stage('Build and Run with Docker Compose') {
            steps {
                script {
                    // 确保进入正确的文件夹并执行 Docker Compose（后台启动）
                    dir('/home/ubuntu/leeterview') {
                        // 使用 docker-compose 指令启动服务，后台执行
                        sh 'docker-compose up -d --build'
                    }
                }
            }
        }

        stage('Show Commit Info and Update Jira') {
            steps {
                script {
                    // 获取最新的 Git 提交信息
                    def commitMsg = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    echo "Commit message: ${commitMsg}"

                    // 从提交信息中提取 Jira 任务号 (例如：LEET-35)
                    def jiraIssue = commitMsg =~ /LEET-\d+/
                    if (jiraIssue) {
                        def issueId = jiraIssue[0]
                        echo "Found Jira Issue: ${issueId}"

                        // 使用 withCredentials 引用 Jenkins 中配置的凭证
                        withCredentials([usernamePassword(credentialsId: 'jira-api-credentials', usernameVariable: 'JIRA_USER', passwordVariable: 'JIRA_API_TOKEN')]) {
                            // 获取该任务的所有 transitions
                            def transitionsResponse = sh(script: """
                                curl -u ${JIRA_USER}:${JIRA_API_TOKEN} \
                                    -X GET \
                                    -H "Content-Type: application/json" \
                                    https://newlife70723.atlassian.net/rest/api/3/issue/${issueId}/transitions
                            """, returnStdout: true).trim()

                            echo "Transitions Response: ${transitionsResponse}"

                            // 提取 transition ID (例如：找到 "完成" 的 transition ID)
                            def transitionId = sh(script: """
                                echo '${transitionsResponse}' | jq -r '.transitions[] | select(.name=="完成") | .id'
                            """, returnStdout: true).trim()

                            echo "Transition ID for 'Completed': ${transitionId}"

                            // 使用 transition ID 更新任务状态
                            if (transitionId) {
                                def updateResponse = sh(script: """
                                    curl -u ${JIRA_USER}:${JIRA_API_TOKEN} \
                                        -X POST \
                                        -H "Content-Type: application/json" \
                                        -d '{
                                            "transition": {
                                                "id": "${transitionId}"
                                            }
                                        }' \
                                        https://newlife70723.atlassian.net/rest/api/3/issue/${issueId}/transitions
                                """, returnStdout: true).trim()

                                echo "Update Response: ${updateResponse}"
                            } else {
                                echo "Transition ID for 'Completed' not found."
                            }
                        }
                    } else {
                        echo "No Jira issue found in commit message."
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
