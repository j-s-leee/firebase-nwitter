import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 15px;
`;

const Column = styled.div`
    &:last-child {
        place-self: end;
    }
`;

const Username = styled.span`
    font-size: 15px;
    font-weight: 600;
`;

const Payload = styled.p`
    margin: 10px 0px;
    font-size: 18px;
`;

const Photo = styled.img`
    width: 100px;
    height: 100px;
    border-radius: 15px;
`;

const DeleteButton = styled.button`
    border: none;
    background-color: tomato;
    color: white;
    border-radius: 5px;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 12px;
    padding: 5px 10px;
    cursor: pointer;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
    const [isLoading, setLoading] = useState(false);
    const user = auth.currentUser;
    const onDelete = async () => {
        const ok = confirm("Are you sure you want to delete this tweet?");
        if (!ok || user?.uid !== userId) return;
        try {
            setLoading(true);
            await deleteDoc(doc(db, "tweets", id));
            if (photo) {
                const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
                await deleteObject(locationRef);
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }
    return <Wrapper>
        <Column>
            <Username>{username}</Username>
            <Payload>{tweet}</Payload>
            {user?.uid === userId ? <DeleteButton onClick={onDelete}>{isLoading ? "Deleting..." : "Delete"}</DeleteButton> : null}
        </Column>
        <Column>
            {photo ? (<Photo src={photo} />) : null}
        </Column>
    </Wrapper>;
}