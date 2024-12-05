import * as nodemailer from "nodemailer";
import * as fs from "fs";
import * as handlebars from "handlebars";
import path from "path";
import {
  EmailDeliveryResponse,
  MailConfigContentTypes,
  MailOptions,
  UserMailConfigTypes,
} from "@/types";

function readHTMLFileAsync(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: "utf-8" }, (err, html) => {
      if (err) {
        reject(err);
      } else {
        resolve(html);
      }
    });
  });
}

export async function sendMail(
  to: string,
  htmlFile: MailConfigContentTypes,
  mailRequest: Record<string, string>,
  userMailConfig: UserMailConfigTypes
) {
  try {
    // e-mail information
    const username = userMailConfig.username;
    const password = userMailConfig.password;
    const port = userMailConfig.port;
    const host = userMailConfig.host;

    // Path of the email content to be sent

    // const rootPath = fs.existsSync(path.resolve("src"))
    //   ? path.resolve("src")
    //   : path.resolve(".");

    // const fullPath: string = rootPath.concat(htmlFile.htmlName + ".html");
    const fullPath: string = path.join(process.cwd(), "public", "template", "feedback.html");


    // Read HTML file asynchronously
    const html = await readHTMLFileAsync(fullPath);

    const template = handlebars.compile(html);

    // We replace the {{code or something}} in the html files with the filled one.
    const replacements: Record<string, string> = {};

    for (const key in mailRequest) {
      replacements[key] = mailRequest[key];
    }

    const htmlToSend: string = template(replacements);

    // Transporter
    const transporter: nodemailer.Transporter = nodemailer.createTransport({
      host: host,
      port: port,
      secure: true, // false ise TLS kullanılacak
      auth: {
        user: username,
        pass: password,
      },
    });

    const mailOptions: MailOptions = {
      from: username,
      to: to,
      subject: htmlFile.title,
      html: htmlToSend,
    };
    // Email sending process
    const info: EmailDeliveryResponse = await transporter.sendMail(mailOptions);
    console.log("Mail sent:", info.messageId);
  } catch (error) {
    console.error("Send Mail Error:", error);
  }
}
