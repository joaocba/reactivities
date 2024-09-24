import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Tab, Header, Card, Image, Grid, Button } from "semantic-ui-react";
import { Photo, Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import PhotoUploadWidget from "../../app/common/imageUpload/PhotoUploadWidget";

interface Props {
    profile: Profile;
}

// eslint-disable-next-line react-refresh/only-export-components
export default observer(function ProfilePhotos({ profile }: Props) {
    const {
        profileStore: { isCurrentUser, uploadPhoto, uploading, loading, setMainPhoto, deletePhoto },
    } = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState("");

    function handlePhotoUpload(file: Blob) {
        uploadPhoto(file).then(() => setAddPhotoMode(false));
    }

    function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    function handleDeletePhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        deletePhoto(photo);
    }

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width="16">
                    <Header
                        floated="left"
                        icon="image"
                        content="Photos"
                    />
                    {isCurrentUser && (
                        <Button
                            floated="right"
                            basic
                            content={addPhotoMode ? "Cancel" : "Add" + " Photo"}
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                        />
                    )}
                </Grid.Column>

                <Grid.Column width="16">
                    {addPhotoMode ? (
                        <PhotoUploadWidget
                            uploadPhoto={handlePhotoUpload}
                            loading={uploading}
                        />
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profile.photos?.map((photo) => (
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    {isCurrentUser && (
                                        <Button.Group
                                            fluid
                                            widths={2}
                                        >
                                            <Button
                                                basic
                                                color="green"
                                                content="Main"
                                                name={"main" + photo.id}
                                                loading={target === "main" + photo.id && loading}
                                                disabled={photo.isMain}
                                                onClick={(e) => handleSetMainPhoto(photo, e)}
                                            />
                                            <Button
                                                name={photo.id}
                                                loading={loading && photo.id === target}
                                                onClick={(e) => handleDeletePhoto(photo, e)}
                                                basic
                                                color="red"
                                                icon="trash"
                                                disabled={photo.isMain}
                                            />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
});
