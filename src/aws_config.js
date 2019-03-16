export default {
  Auth: {
    mandatorySignIn: true,
    region: "us-east-1",
    userPoolId: "us-east-1_B7s7R0tOg",
    userPoolWebClientId: "23d44ianaamorjiuc6a3bhhcj4"
  },
  // Storage: {
  //   AWSS3: {
  //       bucket: 'tailrd-user-photos', //REQUIRED -  Amazon S3 bucket
  //       region: 'us-east-1', //OPTIONAL -  Amazon service region
  //   }
  // },
  aws_appsync_graphqlEndpoint: 'https://l5rw6pc7jrfxhpkp5kf3vrehqy.appsync-api.us-east-1.amazonaws.com/graphql',
  aws_appsync_region: 'us-east-1',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
}
