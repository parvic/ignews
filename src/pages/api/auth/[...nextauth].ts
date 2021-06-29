import NextAuth from 'next-auth'
import { signIn } from 'next-auth/client'
import Providers from 'next-auth/providers'
import { query as q } from "faunadb";

import { fauna } from "services/fauna";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn(user, account, profile) {
      console.log(user);
      const { email } = user;
      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )
        
        return true;
      } catch (error) {
        console.log(error)
        return false;
      }
    }
  }

  // A database is optional, but required to persist accounts in a database
  //database: process.env.DATABASE_URL, //Since we are not using a DB, we don't need to use this in our application
})