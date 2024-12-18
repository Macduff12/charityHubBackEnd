const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, // smtp.gmail.com
            port: process.env.SMTP_PORT,  // 587
            secure: false, // true для 465, false для інших портів
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }
    
    // Валідація електронної адреси
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Логування
    logEmailDetails(to, subject, status, error = null) {
        const timestamp = new Date().toISOString();
        if (error) {
            console.error(`[${timestamp}] Error sending email to: ${to}, Subject: ${subject}, Error: ${error.message}`);
        } else {
            console.log(`[${timestamp}] Email sent to: ${to}, Subject: ${subject}, Status: ${status}`);
        }
    }

    // Функція для створення HTML-шаблону
    createHtmlTemplate(content) {
        return `
            <div style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; color: #333;">
                <div style="max-width: 600px; margin: auto; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    ${content}
                </div>
            </div>
        `;
    }

    // Загальна функція для надсилання листів
    async sendMail(to, subject, html, text = '', attachments = []) {
        if (!this.validateEmail(to)) {
            throw new Error('Невірна електронна адреса');
        }

        console.log(`Sending mail to ${to} with subject: ${subject}`);
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject,
                text,
                html,
                attachments,
            });
            this.logEmailDetails(to, subject, 'Sent');
        } catch (error) {
            this.logEmailDetails(to, subject, 'Failed', error);
            throw new Error('Не вдалося надіслати електронну пошту: ' + error.message);
        }
    }

    async sendActivationMail(to, link) {
        const content = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: url('https://png.pngtree.com/thumb_back/fw800/background/20230722/pngtree-illuminated-mma-octagon-a-thrilling-fight-night-championship-in-3d-image_3869667.jpg') no-repeat center center / cover; color: #fff;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: rgba(0, 0, 0, 0.85); border-radius: 12px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://www.zrteam.com.br/assets/Logo-ZR.png" alt="BJJEngineeringClub Logo" style="max-width: 150px; height: auto; border-radius: 50%; border: 2px solid #fff;">
                    </div>
                    <h1 style="text-align: center; color: #ffdd57; font-size: 28px; margin: 20px 0;">Ласкаво просимо до BJJEngineeringClub!</h1>
                    <p style="font-size: 16px; line-height: 1.8; text-align: center; margin-bottom: 30px;">
                        Дякуємо за приєднання! Щоб активувати ваш акаунт, натисніть кнопку нижче. Це відкриє нові можливості для тренувань і спілкування в нашому клубі!
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${link}" style="padding: 12px 30px; font-size: 16px; color: #fff; background-color: #ff5733; border-radius: 8px; text-decoration: none; display: inline-block; box-shadow: 0 5px 15px rgba(255, 87, 51, 0.3); transition: all 0.3s ease;">
                            Активувати акаунт
                        </a>
                    </div>
                    <p style="font-size: 14px; text-align: center; color: #aaa; margin-top: 20px;">
                        Якщо ви не реєстрували акаунт, просто проігноруйте цей лист.
                    </p>
                    <p style="font-size: 12px; text-align: center; color: #666;">
                        © 2024 BJJEngineeringClub. Всі права захищені.
                    </p>
                </div>
            </div>
            <style>
                a:hover {
                    background-color: #e74c3c;
                    transform: scale(1.05);
                    box-shadow: 0 8px 20px rgba(255, 87, 51, 0.5);
                }
            </style>
        `;
        await this.sendMail(to, 'Активація акаунта на BJJEngineeringClub', this.createHtmlTemplate(content));
    }
    
    
    
    
    

    async sendAccountConfirmationMail(to) {
        const content = `
            <h1 style="text-align: center; color: #4CAF50;">Ваш аккаунт активовано!</h1>
            <p style="font-size: 16px; line-height: 1.5;">
                Дякуємо за підтвердження вашого акаунту. Ви тепер можете користуватися всіма можливостями нашого сервісу.
            </p>
        `;
        await this.sendMail(to, 'Активовано акаунт', this.createHtmlTemplate(content));
    }

   

    async sendMailWithAttachments(to, subject, html, attachments = []) {
        await this.sendMail(to, subject, html, '', attachments);
    }
    async sendResetPasswordMail(to, link) {
        const content = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: url('https://png.pngtree.com/thumb_back/fw800/background/20230722/pngtree-illuminated-mma-octagon-a-thrilling-fight-night-championship-in-3d-image_3869667.jpg') no-repeat center center / cover; color: #fff;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; background: rgba(0, 0, 0, 0.85); border-radius: 12px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://www.zrteam.com.br/assets/Logo-ZR.png" alt="BJJEngineeringClub Logo" style="max-width: 150px; height: auto; border-radius: 50%; border: 2px solid #fff;">
                    </div>
                    <h1 style="text-align: center; color: #ffdd57; font-size: 28px; margin: 20px 0;">Відновлення пароля</h1>
                    <p style="font-size: 16px; line-height: 1.8; text-align: center; margin-bottom: 30px;">
                        Щоб скинути пароль, натисніть кнопку нижче. Якщо ви не ініціювали цей запит, просто ігноруйте цей лист.
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${link}" style="padding: 12px 30px; font-size: 16px; color: #fff; background-color: #ff5733; border-radius: 8px; text-decoration: none; display: inline-block; box-shadow: 0 5px 15px rgba(255, 87, 51, 0.3); transition: all 0.3s ease;">
                            Скинути пароль
                        </a>
                    </div>
                    <p style="font-size: 14px; text-align: center; color: #aaa; margin-top: 20px;">
                        © 2024 BJJEngineeringClub. Всі права захищені.
                    </p>
                </div>
            </div>
            <style>
                a:hover {
                    background-color: #e74c3c;
                    transform: scale(1.05);
                    box-shadow: 0 8px 20px rgba(255, 87, 51, 0.5);
                }
            </style>
        `;
        await this.sendMail(to, 'Скидання пароля на BJJEngineeringClub', this.createHtmlTemplate(content));
    }
    
    async sendTextMail(to, subject, message) {
        const text = message;
        await this.sendMail(to, subject, '', text);
    }

    async sendHtmlMail(to, subject, htmlContent) {
        await this.sendMail(to, subject, htmlContent);
    }
    
}

module.exports = new MailService();
