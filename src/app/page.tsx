import fs from 'fs'; 
import path from 'path'; 
import Link from "next/link";
import { Box, Container, Flex, Heading, Text } from "@radix-ui/themes"; 
import { auth } from "~/server/auth"; 

// Import the WodViewer and ThemeToggle components
import WodViewer from "~/app/_components/WodViewer";
import ThemeToggle from "~/app/_components/ThemeToggle"; // Import ThemeToggle
// Use type import
import type { Wod } from "~/app/_components/WodViewer"; 

export default async function Home() { 
  const session = await auth(); 

  let wodsData: Wod[] = [];
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'wods.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    wodsData = JSON.parse(fileContents) as Wod[]; 
    console.log('Loaded WODs data:', wodsData.length);
  } catch (error) {
    console.error('Error loading WODs data:', error);
  }

  return ( 
      <Box className="min-h-screen bg-background text-foreground"> 
        {/* Fixed Top Bar */}
        <Box className="fixed top-0 left-0 w-full bg-background py-4 px-6 z-10 border-b border-border shadow-md relative"> 
          <Container size="4">
            <Flex align="center">
              <Heading size="5" className="text-foreground"> 
                PRzilla
              </Heading>
              <Flex justify="center" gap="4" className="text-foreground/70 text-sm ml-auto" align="center"> 
                <Text>{wodsData.length} WODs</Text>
                <Text>{wodsData.reduce((total, wod) => total + (wod.results?.length ?? 0), 0)} Sessions</Text>
              </Flex>
            </Flex>
          </Container>
          {/* Absolutely position ThemeToggle */}
          <Box className="absolute top-4 right-6">
             <ThemeToggle />
          </Box>
        </Box>
        
        {/* Main Content with top margin to account for fixed header */}
        <Container size="4" className="pb-8">
          <Flex direction="column" gap="6">
            
            <WodViewer wods={wodsData} /> 
            
            {session?.user && ( 
                <Flex gap="4" mt="4" justify="center"> 
                  <Link
                    href={session ? "/api/auth/signout" : "/api/auth/signin"}
                    className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
                  >
                    {session ? "Sign out" : "Sign in"} 
                  </Link>
                </Flex>
             )} 
          </Flex>
        </Container>
      </Box>
  );
}
