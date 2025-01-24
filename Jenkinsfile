pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = 'leeterview'
        GIT_REPO = 'git@github.com:newlife70723/leeterview-frontend.git' // Git 協議存儲庫
        BRANCH = 'main'
    }

    stages {
        stage('Clean Docker Environment') {
            steps {
                script {
                    dir('/home/ubuntu/leeterview') {
                        sh 'docker-compose down'
                        sh 'docker system prune -a --volumes -f'
                    }
                }
            }
        }

        stage('Pull Latest Code') {
            steps {
                script {
                    dir('/home/ubuntu/leeterview/leeterview-frontend') {
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
                    dir('/home/ubuntu/leeterview') {
                        sh 'docker-compose up -d --build'
                    }
                }
            }
        }

        stage('Show Commit Info and Update Jira') {
            steps {
                script {
                    def commitMsg = sh(script: 'git log -1 --pretty=%B', returnStdout: true).trim()
                    echo "Commit message: ${commitMsg}"

                    def jiraIssue = commitMsg =~ /LEET-\d+/
                    if (jiraIssue) {
                        def issueId = jiraIssue[0]
                        echo "Found Jira Issue: ${issueId}"

                        withCredentials([usernamePassword(credentialsId: 'ee7456d4-e6d3-43de-bbf2-9f54a35dcf76', usernameVariable: 'JIRA_USER', passwordVariable: 'JIRA_API_TOKEN')]) {
                            def transitionsResponse = sh(script: """
                                curl -u ${JIRA_USER}:${JIRA_API_TOKEN} \
                                    -X GET \
                                    -H "Content-Type: application/json" \
                                    https://newlife70723.atlassian.net/rest/api/3/issue/${issueId}/transitions
                            """, returnStdout: true).trim()

                            echo "Transitions Response: ${transitionsResponse}"

                            def transitionId = sh(script: """
                                echo '${transitionsResponse}' | jq -r '.transitions[] | select(.name=="完成") | .id'
                            """, returnStdout: true).trim()

                            echo "Transition ID for 'Completed': ${transitionId}"

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
