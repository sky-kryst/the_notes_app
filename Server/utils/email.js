const nodemailer = require('nodemailer')
const htmlToText = require('html-to-text')

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email
    this.firstName = user.firstName
    this.url = url
    this.from = `Aakash Meshram <${process.env.EMAIL_FROM}>`
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      })
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  async send(mail) {
    const mailOptions = {
      from: this.from,
      to: this.to,
      text: htmlToText.fromString(mail),
      html: mail,
    }

    await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome() {
    const mail = `
    <body>
      <h1 style="margin:auto;text-align:center;">Welcome to the Notes App. Take a tour!</h1>
    </body>
    `
    await this.send(mail)
  }

  async sendPasswordReset() {
    const mail = `
    <body>
      <p>Your password reset token is( valid only for 10 minutes!):</p>

      <p><b>${this.url.split('/')[this.url.split('/').length - 1]}</b></p>

      <p>Copy it to our authentication page or click on this link</p>

      <a href='${this.url}'>${this.url}</a>
    </body>
    `

    await this.send(mail)
  }
}
