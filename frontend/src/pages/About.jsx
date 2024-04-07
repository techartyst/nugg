import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const AboutPage = () => {
  return (
    <div class="content">
  <div>
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
      Simplifying Learning, One Snippet at a Time.
      </Typography>
      <Typography variant="body1" paragraph>
        Nuro is a simple app designed to help you capture concise study cues effortlessly.
      </Typography>
      <Typography variant="body1" paragraph>
      Nuro operates distinctively from traditional learning methods, utilizing randomness to revise topics and ideas in an alternative manner.      </Typography>
      <Typography variant="body1" paragraph>
        <p><strong>How nuro works?</strong></p>
        In the age of information overload, where there's too much going on, nuro provides a simple solution. It allows you to record knowledge snippets (we call it nuggets) that you hear, read, reflect on, and engage with, and tag them under specific topics.
      </Typography>
      
      <Typography variant="body1" paragraph>
      <p><strong>How nuro helps you?</strong></p>
        With Nuro's "Random Nugget" feature, you can run our algorithm to receive a random snippet from your collection. This alternative approach helps reindex your mind and reorganize your information, making learning more engaging and efficient.
      </Typography>
      <Typography variant="body1" paragraph>
        Additionally, Nuro allows you to organize and retrieve your knowledge snippets by tags. You can easily navigate through your collection, filter by specific topics, and review related information effortlessly.
      </Typography>
      <Typography variant="body1" paragraph>
      <p><strong>Does Nuro function on mobile devices?</strong></p>

        Nuro is mobile-friendly, ensuring that you can access your study cues anytime, anywhere, from any device.
      </Typography>
      <Typography variant="body1" paragraph>
  <p><strong>How much does Nuro cost?</strong></p>
Nuro is free to use, providing accessible study cues anytime, anywhere, from any device.
</Typography>
    </Box>
  </div>
</div>
  );
};

export default AboutPage;
