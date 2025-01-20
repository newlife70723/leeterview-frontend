pipeline {
    agent any  // 在任何可用的 Jenkins 節點上運行

    environment {
        COMPOSE_PROJECT_NAME = 'leeterview'
        GIT_REPO_URL = 'https://github.com/newlife70723/leeterview-frontend.git'
        GIT_BRANCH = 'main'
    }

    stages {
        stage('Checkout') {
            steps {
                // 檢出代碼
                git branch: "${GIT_BRANCH}", url: "${GIT_REPO_URL}"
            }
        }

        stage('Show Commit Info and Update Jira') {
            steps {
                script {
                    // 顯示最新的 commit 訊息
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
            echo 'Jira task status updated successfully and pipeline executed!'
        }
        failure {
            echo 'Failed to update Jira task status or pipeline execution failed.'
        }
    }
}
