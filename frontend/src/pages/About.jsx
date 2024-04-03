import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const AboutPage = () => {
  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
        Simplifying Learning, One Snippet at a Time.
        </Typography>
        <Typography variant="body1" paragraph>
          Nuro is a simple app designed to help you capture concise study cues effortlessly.
        </Typography>
        <Typography variant="body1" paragraph>
          In the age of information overload, where there's too much going on, Nuro provides a simple solution. It allows you to record knowledge snippets (we call it nuggets) that you hear, read, reflect on, and engage with, and tag them under specific topics.
        </Typography>
        <Typography variant="body1" paragraph>
          Nuro is mobile-friendly, ensuring that you can access your study cues anytime, anywhere, from any device.
        </Typography>
        <Typography variant="body1" paragraph>
          With Nuro's "Random Nugget" feature, you can run our algorithm to receive a random snippet from your collection. This innovative approach helps reindex your mind and reorganize your information, making learning more engaging and efficient.
        </Typography>
        <Typography variant="body1" paragraph>
          Additionally, Nuro allows you to organize and retrieve your knowledge snippets by tags. You can easily navigate through your collection, filter by specific topics, and review related information effortlessly.
        </Typography>
      </Box>
    </Container>
  );
};

export default AboutPage;
