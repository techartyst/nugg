import React from 'react';
import { Container, Box } from '@mui/material';

const AboutPage = () => {
  return (
    <div className="content">
      <div class="para" >
        <Box mt={0}>
          <h3>Simplifying Learning, One Snippet at a Time.</h3>
          <p>nugg is a simple app designed to help you capture concise study cues effortlessly.</p>
          <br></br>
          <p>"nugg" is a shortened form of "nugget" which refers to a snippet of knowledge typically recorded on flashcard for quick revision or review.</p>
          <br></br>

          <p><strong>How it all began?</strong></p>

          <p>Our journey began with a personal need: to efficiently revise small notes. We developed a tool to add, tag, and revise these "small nuggets" of information. You can find the code base on the <a href='https://github.com/techartyst/nugg.git' target='_blank'>github page.</a></p>
          <br></br>

          <p><strong>Who is nugg for?</strong></p>
          <p>nugg is for everyone! However, nugg works best for individuals who prefer incorporating randomness into their memory revision and study process. If you enjoy unconventional methods of revising topics and ideas, Nugg offers a distinct approach from traditional learning methods.</p>
          <br></br>

          <p><strong>How nugg works?</strong></p>
          <p>In the age of information overload, where there's too much going on, Nugg provides a simple solution. It allows you to record knowledge snippets (we call it nuggs) that you hear, read, reflect on, and engage with, and tag them under specific topics.</p>
          <br></br>

          <p><strong>How nugg helps you?</strong></p>
          <p>With Nugg's "Random Nugget" feature, you can run our algorithm to receive a random snippet from your collection. This alternative approach helps reindex your mind and reorganize your information, making learning more engaging and efficient.</p>
          <p>Additionally, nugg allows you to organize and retrieve your knowledge snippets by tags. You can easily navigate through your collection, filter by specific topics, and review related information effortlessly.</p>
          <br></br>

          <p><strong>Does nugg function on mobile devices?</strong></p>
          <p>nugg is mobile-friendly, ensuring that you can access your study cues anytime, anywhere, from any device.</p>
          <br></br>

          <p><strong>How much does nugg cost?</strong></p>
          <p>nugg is free to use, providing accessible study cues anytime, anywhere, from any device. Any queries reach out at afzal[@]theartist.me</p>
        </Box>
     
      </div>
    </div>
  );
};

export default AboutPage;
