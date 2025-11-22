import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore, User } from '@/store/authStore';
import { db, DB_COLLECTIONS } from '@/lib/database';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Users = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<Omit<User, 'password'>[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const allUsers = await db.getCollection<User>(DB_COLLECTIONS.USERS);
      // Remove password from users
      const usersWithoutPassword = allUsers.map(({ password, ...user }) => user);
      setUsers(usersWithoutPassword);
    };
    loadUsers();
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">Manage system users</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentUser && (
                <div className="mb-4 p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Current User</h3>
                  <div className="space-y-1 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span> {currentUser.name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span> {currentUser.email}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Role:</span> {currentUser.role}
                    </div>
                  </div>
                </div>
              )}
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Users;
