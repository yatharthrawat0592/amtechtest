pipeline {
    agent any
    
    stages {
        stage('build and deploy') {
            steps {
                 sh 'docker-compose up -d'
            }
        }
        
    } 
        
        // Add more stages as needed
    }
    
    // You can also define post-build actions here
    post {
        success {
            echo  'server is up.'
