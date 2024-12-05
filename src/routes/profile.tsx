import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import Tweet from "../components/tweet";
import { ITweet } from "../components/timeline";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
`;
const AvatarUpload = styled.label`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    background-color: tan;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        fill: white;
        width: 50px;
    }
`;
const AvatarImg = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
const AvatarInput = styled.input`
    display: none;
`;
const Name = styled.span`
    color: white;
    font-size: 22px;
    cursor: pointer;
    svg {
        margin-left: .5rem;
        width: 1rem;
    }
`;
const Form = styled.form``;
const Input = styled.input`
    background-color: black;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    border: 1px solid white;
    font-size: 16px;
    &:focus {
        outline: none;
        border-color: #1d9bf0;
    }
    &:autofill {
        -webkit-text-fill-color: white;
        box-shadow: 0 0 0 30px black inset;
    }
    &[type="submit"] {
        text-transform: uppercase;
        margin-left: .5rem;
        cursor: pointer;
        &:hover {
            opacity: 0.8;
        }
    }
`;
const Tweets = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
`;

export default function Profile() {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [editable, setEditable] = useState(false);
    const [displayName, setDisplayName] = useState(user?.displayName ?? 'Anonymous');
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const fetchTweets = async () => {
        const tweetsQuery = query(
            collection(db, "tweets"),
            where("userId", "==", user?.uid),
            orderBy("createdAt","desc" ),
            limit(25)
        );
        const snapshot = await getDocs(tweetsQuery);
        const tweets = snapshot.docs.map((doc) => {
            const { tweet, createdAt, userId, username, photo } = doc.data();
            return {
                tweet,
                createdAt,
                userId,
                username,
                photo,
                id: doc.id,
            };
        });
        setTweets(tweets);
    }
    useEffect(() => {
        fetchTweets();
    },[]);
    const changeEditable = () => {
        setEditable(true);
    }
    const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (!user) return;
        if (files && files.length === 1) {
            const file = files[0];
            const avatarRef = ref(storage, `avatar/${user.uid}`);
            const result = await uploadBytes(avatarRef, file);
            const url = await getDownloadURL(result.ref);
            setAvatar(url);
            await updateProfile(user, {
                photoURL: url
            });
        }
    }
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {target: { name, value }} = e;
        if (name === "name") {
            setDisplayName(value);
        }
    }
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user) return;
        if (displayName === "") return;
        
        await updateProfile(user, {
            displayName: displayName
        });
        setEditable(false);
    }

    return <Wrapper>
        <AvatarUpload htmlFor="avatar">
        {avatar ? <AvatarImg src={avatar} /> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
</svg>
}
        </AvatarUpload>
        <AvatarInput id="avatar" type="file" accept="image/*" onChange={onAvatarChange} />
        {editable ? <Form onSubmit={onSubmit}>
            <Input onChange={onChange} value={displayName} name="name" required spellCheck={false} />
            <Input type="submit" value={"Edit"} />
        </Form> : <Name onClick={changeEditable}>{displayName}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
            </svg>
        </Name>}
        <Tweets>
            {tweets.map((tweet) => <Tweet key={tweet.id} {...tweet} />)}
        </Tweets>
    </Wrapper>;
}