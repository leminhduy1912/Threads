import { useRecoilValue } from "recoil";


import SignUpCard from "../components/SignUpCard";
import authScreenAtom from "../atoms/authScreenAtom";
import LoginCard from "../components/LoginCard";


const AuthPage = () => {
	const authScreenState = useRecoilValue(authScreenAtom);
	return <>{authScreenState == "login" ? <LoginCard /> : <SignUpCard />}</>;
};

export default AuthPage;