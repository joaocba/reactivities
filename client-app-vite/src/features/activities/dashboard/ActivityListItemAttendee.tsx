import { observer } from "mobx-react-lite";
import { List, Image, Popup } from "semantic-ui-react";
import { Profile } from "../../../app/models/profile";
import { Link } from "react-router-dom";
import ProfileCard from "../../profiles/ProfileCard";

interface Props {
    attendees: Profile[];
}

// eslint-disable-next-line react-refresh/only-export-components
export default observer(function ActivityListItemAttendee({ attendees }: Props) {
    const styles = {
        borderColor: "orange",
        borderWidth: 3,
    };

    return (
        <List horizontal>
            {attendees.map((attendee) => (
                <Popup
                    hoverable
                    key={attendee.username}
                    trigger={
                        <List.Item
                            as={Link}
                            to={`/profiles/${attendee.username}`}
                        >
                            <Image
                                size="mini"
                                style={attendee.following ? styles : null}
                                bordered
                                circular
                                src={attendee.image || `/assets/user.png`}
                            />
                        </List.Item>
                    }
                >
                    <Popup.Content>
                        <ProfileCard profile={attendee} />
                    </Popup.Content>
                </Popup>
            ))}
        </List>
    );
});
