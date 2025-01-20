pipeline {
    agent any  // 在任何可用的 Jenkins 節點上運行

    environment {
        COMPOSE_PROJECT_NAME = 'leeterview'
    }

    stages {
        stage('Checkout') {
            steps {
                // 檢出代碼
                git branch: 'main', url: 'https://github.com/newlife70723/leeterview-frontend.git'
            }
        }

        stage('Show Commit Info') {
            steps {
                script {
                    // 顯示最新的 commit 訊息
                    sh 'git log -1 --pretty=format:"%h - %s"'
                }
            }
        }
    }

    post {
        success {
            echo 'Jenkins pipeline triggered successfully!'
        }
        failure {
            echo 'Jenkins pipeline failed!'
        }
    }
}
