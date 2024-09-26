import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";

// eslint-disable-next-line react-refresh/only-export-components
export default observer(function ProfilePage() {
    const { username } = useParams();
    const { profileStore } = useStore();
    const { loadingProfile, loadProfile, profile, setActiveTab } = profileStore;

    // Load the profile of the user
    useEffect(() => {
        if (username) loadProfile(username);
        return () => {
            setActiveTab(0);
        };
    }, [loadProfile, username, setActiveTab]);

    // If the profile is loading, show a loading component
    if (loadingProfile)
        return (
            <LoadingComponent
                inverted
                content="Loading profile..."
            />
        );

    if (!profile) return <h2>Problem loading profile</h2>;

    return (
        <Grid>
            <Grid.Column width="16">
                {profile && (
                    <>
                        <ProfileHeader profile={profile} />
                        <ProfileContent profile={profile} />
                    </>
                )}
            </Grid.Column>
        </Grid>
    );
});
