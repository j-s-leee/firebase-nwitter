import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import styled from "styled-components";
import PostTweetForm from "../components/post-tweet-form";

const Wrapper = styled.div``;

export default function Home() {
    const navigate = useNavigate();
    const logOut = () => {
        auth.signOut();
        navigate("/login");
    }
    return <Wrapper>
        <PostTweetForm />
        <button onClick={logOut}>Log Out</button>
    </Wrapper>;
}