import React, { useEffect, useState } from "react";
import useQuery from "../../app/util/hooks";
import { useStore } from "../../app/stores/store";
import agent from "../../app/api/agent";
import { toast } from "react-toastify";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import LoginForm from "./LoginForm";

export default function ConfirmEmail() {
    const { modalStore } = useStore();
    const email = useQuery().get("email") as string;
    const token = useQuery().get("token") as string;

    const Status = {
        Verifying: "Verifying",
        Success: "Success",
        Failed: "Failed",
    };

    const [status, setStatus] = useState(Status.Verifying);

    function handleConfirmEmailResend() {
        agent.Account.resendEmailConfirm(email)
            .then(() => {
                toast.success("Email confirmation link resent");
            })
            .catch((error) => console.log(error));
    }

    useEffect(() => {
        agent.Account.verifyEmail(token, email)
            .then(() => {
                setStatus(Status.Success);
            })
            .catch(() => {
                setStatus(Status.Failed);
            });
    }, [Status.Failed, Status.Success, token, email]);

    function getBody() {
        switch (status) {
            case Status.Verifying:
                return <p>Verifying...</p>;
            case Status.Failed:
                return (
                    <div>
                        <p>Failed to verify email. Please try again.</p>
                        <Button
                            primary
                            onClick={handleConfirmEmailResend}
                            size="huge"
                            content="Resend email"
                        />
                    </div>
                );
            case Status.Success:
                return (
                    <div>
                        <p>Email verified successfully.</p>
                        <Button
                            primary
                            onClick={() => modalStore.openModal(<LoginForm />)}
                            size="huge"
                            content="Login"
                        />
                    </div>
                );
        }
    }

    return (
        <Segment
            placeholder
            textAlign="center"
        >
            <Header icon>
                <Icon name="envelope" />
                Email Verification
            </Header>
            <Segment.Inline>{getBody()}</Segment.Inline>
        </Segment>
    );
}
