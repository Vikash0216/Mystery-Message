import * as React from "react";
import {
  Html,
  Head,
  Body,
  Font,
  Preview,
  Heading,
  Section,
  Text,
  Button,
  Container,
} from "@react-email/components";

interface VerificationEmailProps {
  userName: string;
  otp: string;
}

export default function VerificationEmail({ userName, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Helvetica"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap",
            format: "woff2",
          }}
        />
      </Head>

      <Preview>Your OTP is here! Use it to verify your account</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading as="h2" style={heading}>Hello, {userName} 👋</Heading>
          </Section>

          <Section>
            <Text style={text}>
              Here is your verification code. Enter it to complete your sign-up process.
            </Text>

            <Text style={otpStyle}>{otp}</Text>

            <Text style={text}>
              This OTP will expire in 10 minutes. If you didn't request this, please ignore this message.
            </Text>
          </Section>

          <Section style={{ textAlign: "center", marginTop: "24px" }}>
            <Button
              style={button}
              href="#"
            >
              Verify Now
            </Button>
          </Section>

          <Section>
            <Text style={footer}>
              Thank you for choosing us.<br />– The Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// === Styles ===

const main = {
  backgroundColor: "#f8fafc",
  padding: "20px",
  fontFamily: "'Roboto', Helvetica, Arial, sans-serif",
};

const otpStyle = {
  fontSize: "32px",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
  letterSpacing: "6px",
  color: "#000000",
  margin: "20px 0",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "32px",
  maxWidth: "520px",
  margin: "0 auto",
  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)",
};

const header = {
  borderBottom: "1px solid #e2e8f0",
  paddingBottom: "16px",
  marginBottom: "24px",
};

const heading = {
  fontSize: "22px",
  color: "#111827",
  fontWeight: "700",
  margin: 0,
};

const text = {
  fontSize: "16px",
  color: "#374151",
  lineHeight: "1.6",
};

const otp = {
  fontSize: "32px",
  fontWeight: "bold" as const,
  textAlign: "center" as const,
  letterSpacing: "6px",
  color: "#000000",
  margin: "20px 0",
};

const button = {
  backgroundColor: "#0f172a",
  color: "#ffffff",
  padding: "12px 24px",
  borderRadius: "8px",
  fontSize: "16px",
  textDecoration: "none",
};

const footer = {
  fontSize: "14px",
  color: "#94a3b8",
  marginTop: "30px",
  textAlign: "center" as const,
};
