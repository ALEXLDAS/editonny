export const audioMedia = [
  {
    id: 'voice-effect', title: 'A voice effect in one interval', category: 'Audio',
    summary: 'A brief change in tone to reinforce an intention.',
    when: 'A phrase calls for a radio, megaphone, robot, or another available treatment.',
    goal: 'Within my specified interval, inspect available editonny voice effects and test the one matching my intent. Preserve words, synchronization, and the original voice outside that interval, with smooth boundaries. Show a sample to check intelligibility and strength; do not promise to imitate a person or exactly reproduce another tool',
    tips: ['Specify start, end, and the intended mood.', 'If the cut changes later, rebuild the effect from the updated audio.'],
  },
  {
    id: 'generated-media', title: 'Generated media for a scene', category: 'Visuals',
    summary: 'Evaluate a transformation and test its video integration.',
    when: 'The idea involves transforming an object, changing a background, or adding an element.',
    goal: 'Inspect available editonny recipes and evaluate my visual transformation using tools actually present in this environment. Identify required media, limitations, third-party transmission, and costs before execution. Do not send media or spend credits without my specific authorization. Preserve the original and test a short interval before integrating the result, maintaining continuity and voice. Label the result as an effect or illustration rather than real evidence',
    tips: ['Describe what changes, where, and how it should enter the video.', 'If a required tool is unavailable, propose supplied media or a simpler local composition.'],
  },
  {
    id: 'sound-effects', title: 'Sounds at the right moments', category: 'Audio',
    summary: 'Reinforce entrances and movement without tiring the listener.',
    when: 'Animations are silent or there are too many effects.',
    goal: 'Review sound effects and retain only those reinforcing important movement or changes. Align each sound peak with its movement and keep it below the speech. If I request a sound for every animation, keep effects light and remove confusing overlaps',
    tips: ['Specify subtle or more pronounced sound.', 'Use available effects with appropriate usage rights.'],
  },
  {
    id: 'music', title: 'Keep music below the voice', category: 'Audio',
    summary: 'Supporting music with a consistent level.',
    when: 'You want to add music or fix its volume.',
    goal: 'Use supplied or authorized available music and match its passage to the mood. Keep the voice in the foreground, lower music during speech, and avoid abrupt entrances and exits. Check the final mix and do not add music when its usage rights are unclear',
    tips: ['Supply music and confirm your right to use it.', 'Say whether it is too loud, nearly inaudible, or not selected yet.'],
  },
  {
    id: 'clean-audio', title: 'Reduce background noise', category: 'Audio',
    summary: 'Test cleanup that preserves the voice.',
    when: 'A fan, traffic, or other noise interferes with speech.',
    goal: 'Evaluate the audio and prepare a short before-and-after comparison with moderate noise reduction. Preserve natural, intelligible speech and avoid metallic artifacts. Report what cannot be recovered, especially distortion or strong reverberation, and evaluate the sample before extending the treatment',
    tips: ['Use the best available original audio.', 'Include speech and silence in the comparison.'],
  },
];
