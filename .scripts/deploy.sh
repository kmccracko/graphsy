echo "Processing deploy.sh"
# Set EB BUCKET as env variable
EB_BUCKET=elasticbeanstalk-us-east-2-888780614544
# Set the default region for aws cli
aws configure set default.region us-east-2
# Log in to ECR
eval $(aws ecr get-login --no-include-email --region us-east-2)
# Build docker image based on our production Dockerfile
docker build -t 888780614544/mm .
# tag the image with the GitHub SHA
docker tag 888780614544/mm:latest 888780614544.dkr.ecr.us-east-2.amazonaws.com/graphsy:$GITHUB_SHA
# Push built image to ECS
docker push 888780614544.dkr.ecr.us-east-2.amazonaws.com/graphsy:$GITHUB_SHA
# Use the linux sed command to replace the text '<VERSION>' in our Dockerrun file with the GitHub SHA key
sed -i='' "s/<VERSION>/$GITHUB_SHA/" Dockerrun.aws.json
# Zip up our codebase, along with modified Dockerrun and our .ebextensions directory
zip -r mm-prod-deploy.zip Dockerrun.aws.json .ebextensions
# Upload zip file to s3 bucket
aws s3 cp mm-prod-deploy.zip s3://$EB_BUCKET/mm-prod-deploy.zip
# Create a new application version with new Dockerrun
aws elasticbeanstalk create-application-version --application-name g5 --version-label $GITHUB_SHA --source-bundle S3Bucket=$EB_BUCKET,S3Key=mm-prod-deploy.zip
# Update environment to use new version number
aws elasticbeanstalk update-environment --environment-name G5-env --version-label $GITHUB_SHA