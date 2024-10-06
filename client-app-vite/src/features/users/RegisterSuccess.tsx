import React from "react";
import useQuery from "../../app/util/hooks";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";

export default function RegisterSuccess() {
    const email = useQuery().get("email") as string;

    function handleConfirmEmailResend() {
        agent.Account.resendEmailConfirm(email)
            .then(() => {
                toast.success("Email confirmation link resent");
            })
            .catch((error) => console.log(error));
    }

    return (
        <Segment
            placeholder
            textAlign="center"
        >
            <Header
                icon
                color="green"
            >
                <Icon name="check" />
                Successfully registered!
            </Header>
            <p>Please check your email to confirm your account.</p>
            {email && (
                <>
                    <p>If you did not receive the email, please click the button below to resend the confirmation link.</p>
                    <Button
                        primary
                        onClick={handleConfirmEmailResend}
                        content="Resend confirmation link"
                        size="huge"
                    />
                </>
            )}
        </Segment>
    );
}
