pipeline {
    agent any
    
    stages {
        stage('build and deploy') {
            steps {
                 sh 'sudo -Schown -R $USER:$USER /home/ubuntu/actions-runner/_work/amtechtest'
                 sh 'sudo -S docker-compose up -d'
            }
        }
       } 
    } 
        
   // You can also define post-build actions here
    post {
        success {
            echo  'server is up..'
        }
    }
