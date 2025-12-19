import UserState from "./state-management/UserState";
import Settings from "./state-management/Settings";
import ChannelState from "./state-management/ChannelState";
import Categories from "./state-management/Categories";
import SearchState from "./state-management/SearchState";

import Layout from "./components/Layout";
export default function App() {
  return (
    <SearchState>
      <Categories>
        <ChannelState>
          <Settings>
            <UserState>
              <Layout />
            </UserState>
          </Settings>
        </ChannelState>
      </Categories>
    </SearchState>
  );
}
