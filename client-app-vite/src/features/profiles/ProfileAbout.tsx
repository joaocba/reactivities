import { observer } from "mobx-react-lite";
import ProfileEditForm from "./ProfileEditForm";
import { Tab, Grid, Header, Button } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export default observer(function ProfileAbout() {
    const { profileStore } = useStore();
    const { isCurrentUser, profile } = profileStore;
    const [editMode, setEditMode] = useState(false);

    return (
        <>
            <Tab.Pane>
                <Grid>
                    <Grid.Column width="16">
                        <Header
                            floated="left"
                            icon="user"
                            content={`About ${profile?.displayName}`}
                        />
                        {isCurrentUser && (
                            <Button
                                floated="right"
                                basic
                                content={editMode ? "Cancel" : "Edit Profile"}
                                onClick={() => setEditMode(!editMode)}
                            />
                        )}
                    </Grid.Column>
                    <Grid.Column width="16">{editMode ? <ProfileEditForm setEditMode={setEditMode} /> : <span style={{ whiteSpace: "pre-wrap" }}>{profile?.bio}</span>}</Grid.Column>
                </Grid>
            </Tab.Pane>
        </>
    );
});
