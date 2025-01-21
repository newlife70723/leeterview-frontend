pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'leeterview'  // 自定义项目名称
        GIT_REPO = 'git@github.com:newlife70723/leeterview-frontend.git' // Git 協議存儲庫
        BRANCH = 'main' // 分支名稱
    }

    stages {
        stage('Clean Docker Environment') { // 新增清理阶段
            steps {
                script {
                    dir('/home/ubuntu/leeterview') {
                        // 停止並刪除當前運行的容器
                        sh 'docker-compose down'

                        // 清理未使用的鏡像、容器、網路和卷
                        sh 'docker system prune -a --volumes -f'
                    }
                }
            }
        }

        stage('Pull Latest Code') {
            steps {
                script {
                    // 確保進入正確的目錄
                    dir('/home/ubuntu/leeterview/leeterview-frontend') {
                        // 使用 SSH 憑證拉取代碼
                        withCredentials([sshUserPrivateKey(credentialsId: 'git-ssh-credentials', keyFileVariable: 'SSH_KEY')]) {
                            sh '''
                                eval $(ssh-agent -s)
                                ssh-add ${SSH_KEY}
                                git reset --hard
                                git fetch origin ${BRANCH}
                                git checkout ${BRANCH}
                                git pull origin ${BRANCH}
                            '''
                        }
                    }
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
                        withCredentials([usernamePassword(credentialsId: 'ee7456d4-e6d3-43de-bbf2-9f54a35dcf76', usernameVariable: 'JIRA_USER', passwordVariable: 'JIRA_API_TOKEN')]) {
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
