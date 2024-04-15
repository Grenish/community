import Feeds from "./components/Feeds";
import Posts from "./components/Posts";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

function App() {
  return (
    <>
      <SignedOut>
        <SignInButton />
        <Posts />
      </SignedOut>
      <SignedIn>
        <Posts />
      </SignedIn>
    </>
  );
}

export default App;
