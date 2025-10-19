import nodemailer from "nodemailer";
import path from "path";
// import hbs from "nodemailer-express-handlebars";
import { hbs } from "./handlebar";
import { create } from "express-handlebars";
import { nodemailer_account } from "../config/config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        ...nodemailer_account,
    },
});

// const handlebarOptions = {
//     viewEngine: create({
//         extname: ".hbs",
//         partialsDir: path.resolve("./src/templates/"),
//         layoutsDir: path.resolve("./src/templates/"),
//         defaultLayout: false,
//     }),
//     viewPath: path.resolve("./src/templates/"),
//     extName: ".hbs",
// };

// transporter.use("compile", hbs(handlebarOptions));

export const sendEmail = async (
    to: string,
    subject: string,
    template: string,
    userInfo: Record<string, any>
) => {
    const compiledTemplate = hbs(`${template}.hbs`);

    const html = compiledTemplate({
        name: userInfo.name,
        link: userInfo.link,
    });

    return await transporter.sendMail({
        from: nodemailer_account.user,
        to,
        subject,
        html,
    });
};
