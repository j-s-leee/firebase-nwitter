import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components"
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";

export interface ITweet {
    id: string;
    photo?: string;
    username: string;
    userId: string;
    tweet: string;
    createdAt: number;
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export default function Timeline() {
    const [tweets, setTweet] = useState<ITweet[]>([]);
    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;
        const fetchTweets = async () => {
            const tweetsQuery = query(
                collection(db, "tweets"),
                orderBy("createdAt","desc" ),
                limit(25)
            );

            // const snapshot = await getDocs(tweetsQuery);
            // const tweets = snapshot.docs.map((doc) => {
            //     const { tweet, createdAt, userId, username, photo } = doc.data();
            //     return {
            //         tweet,
            //         createdAt,
            //         userId,
            //         username,
            //         photo,
            //         id: doc.id,
            //     };
            // });

            unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
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
                setTweet(tweets);
            });
        }
        fetchTweets();
        return () => {
            unsubscribe && unsubscribe();
        }
    }, []);

    return <Wrapper>
        {tweets.map((tweet) => <Tweet key={tweet.id} {...tweet} />)}
    </Wrapper>
}