import { List, Datagrid, TextField, EmailField } from "react-admin";

export const UserList = () => (
    <List perPage={10} sort={{ field: "createdAt", order: "DESC" }}>
        <Datagrid rowClick={false}>
            <TextField source="id" />
            <TextField source="fullName" />
            <EmailField source="email" />
            <TextField source="phone" />
            <TextField source="role" />
        </Datagrid>
    </List>
);
