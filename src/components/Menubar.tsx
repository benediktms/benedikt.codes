import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "./ModeToggle";
import { Link } from "./ui/link";

export const Menubar = () => {
  return (
    <NavigationMenu className="my-3 md:mb-16 sm:mb-8 min-w-full justify-start">
      <NavigationMenuList>
        <div className="flex justify-between items-center w-full">
          <NavigationMenuItem className="md:w-96 xs:w-48">
            <a className="text-3xl mr-10 hover:underline" href="/">
              <NavigationMenuLink>&lt;benedikt.codes /&gt;</NavigationMenuLink>
            </a>
          </NavigationMenuItem>
          <div className="flex items-center">
            <NavigationMenuItem>
              <Link color="green" href="/blog" className="mr-3">
                <NavigationMenuLink>blog</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link color="green" href="/about" className="mr-3">
                <NavigationMenuLink>about</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <ModeToggle />
            </NavigationMenuItem>
          </div>
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
