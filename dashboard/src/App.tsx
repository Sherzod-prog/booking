import { Admin, Resource } from "react-admin";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import GroupIcon from "@mui/icons-material/Group";

import { dataProvider } from "./providers/dataProvider";
import { authProvider } from "./providers/authProvider";

import { Dashboard } from "./resources/dashboard/Dashboard";
import { ListingList } from "./resources/listings/ListingList";
import { ListingCreate } from "./resources/listings/ListingCreate";
import { ListingEdit } from "./resources/listings/ListingEdit";
import { BookingList } from "./resources/bookings/BookingList";
import { BookingEdit } from "./resources/bookings/BookingEdit";
import { UserList } from "./resources/users/UserList";

import { getStoredRole, isAdmin, isAdminOrManager } from "./utils/permissions";


const App = () => {

    const role = getStoredRole();


    return (
        <Admin
            dashboard={Dashboard}
            dataProvider={dataProvider}
            authProvider={authProvider}
        >
            <Resource
                name="listings"
                list={ListingList}
                create={isAdminOrManager(role) ? ListingCreate : undefined}
                edit={isAdminOrManager(role) ? ListingEdit : undefined}
                icon={ApartmentIcon}
            />

            <Resource
                name="bookings"
                list={BookingList}
                edit={isAdmin(role) ? BookingEdit : undefined}
                icon={BookOnlineIcon}
            />

            {isAdmin(role) && (
                <Resource
                    name="users"
                    list={UserList}
                    icon={GroupIcon}
                />
            )}
        </Admin>
    );
};

export default App;
