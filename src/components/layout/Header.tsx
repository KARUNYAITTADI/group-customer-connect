
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import UserMenu from "@/components/UserMenu";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white">
      <h1 className="text-xl font-bold">{title}</h1>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search here..."
            className="w-64 pl-8"
          />
        </div>
        
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
        
        <UserMenu />
      </div>
    </header>
  );
};

export default Header;
