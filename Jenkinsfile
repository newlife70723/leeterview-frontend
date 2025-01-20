pipeline {
    agent any  // 在任何可用的 Jenkins 节点上运行

    stages {
        stage('Checkout') {
            steps {
                // 检出代码
                git branch: 'main', url: 'https://github.com/newlife70723/leeterview-frontend.git'
            }
        }

        stage('Show Commit Info') {
            steps {
                script {
                    // 获取最新的 Git 提交信息
                    def commitMsg = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    echo "Commit message: ${commitMsg}"
                }
            }
        }

        stage('Build with Docker Compose') {
            steps {
                script {
                    // 确保进入正确的文件夹并执行 Docker Compose
                    dir('/home/ubuntu/leeterview') {
                        // 使用 docker-compose 指令启动服务，并在容器退出时中止
                        echo 'Building Docker images with Docker Compose...'
                        sh 'docker-compose -f docker-compose.yml up --build --abort-on-container-exit'
                    }
                }
            }
        }

        stage('Update Jira Task') {
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
            echo 'Jira task status updated successfully and Docker build completed!'
        }
        failure {
            echo 'Failed to update Jira task status or Docker build failed.'
        }
    }
}
