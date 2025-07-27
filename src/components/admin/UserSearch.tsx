"use client";

import { UserData } from "@/app/types/userdata";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import useDebounce from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

interface UserSearchProps {
  onUserSelect: (user: UserData) => void;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export default function UserSearch({
  onUserSelect,
  placeholder = "Search for a user",
  value = "",
  onValueChange,
}: UserSearchProps) {
  const [input, setInput] = useState(value);
  const debouncedQuery = useDebounce(input, 300);
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (onValueChange) {
      onValueChange(input);
    }
  }, [input, onValueChange]);

  useEffect(() => {
    if (value !== input) {
      setInput(value);
    }
  }, [value]);

  useEffect(() => {
    if (debouncedQuery === "") {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/admin/getUsers", {
          method: "POST",
          body: JSON.stringify({ query: debouncedQuery }),
        });
        const userData = await res.json();
        console.log(userData);
        setUsers(userData as UserData[]);
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [debouncedQuery]);

  return (
    <Command shouldFilter={false}>
      <CommandInput placeholder={placeholder} value={input} onValueChange={setInput} />
      <CommandList className="max-h-[200px] overflow-y-auto">
        {isLoading && <div className="py-2 px-4 text-sm text-muted-foreground">Searching...</div>}
        {!isLoading && users.length === 0 && debouncedQuery && (
          <div className="py-2 px-4 text-sm text-muted-foreground">No users found</div>
        )}
        {!isLoading && users.length > 0 && (
          <div className="py-1 px-2 text-xs text-muted-foreground">
            {users.length} user(s) found
          </div>
        )}
        {users.map((user) => (
          <CommandItem
            key={user.id}
            value={user.publicName || "Unknown User"}
            onSelect={() => {
              onUserSelect(user);
              setInput(user.publicName || "");
            }}
          >
            {user.publicName || "Unknown User"}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
}
