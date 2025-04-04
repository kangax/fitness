import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import ThemeToggle from "~/app/_components/ThemeToggle";
import PageNavigation from "~/app/_components/PageNavigation";
import AuthControls from "~/app/_components/AuthControls"; // Import the new component

export default function Header() {
  return (
    <Box className="fixed relative left-0 top-0 z-10 w-full border-b border-border bg-background px-6 py-4 shadow-md">
      <Container size="4" className="relative">
        <Flex align="center" justify="between">
          <Heading size="5" className="text-foreground">
            PRzilla
          </Heading>
          <Flex gap="4" align="center">
            <ThemeToggle />
            <AuthControls />
          </Flex>
        </Flex>
        <Box className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <PageNavigation />
        </Box>
      </Container>
    </Box>
  );
}
