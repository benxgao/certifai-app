// Test slug generation
function createSlug(name) {
  return (
    name
      .toLowerCase()
      .trim()
      // Replace spaces and special characters with hyphens
      .replace(/[\s\W-]+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '')
      // Limit length and remove any trailing hyphens
      .substring(0, 100)
      .replace(/-+$/, '')
  );
}

console.log('Testing slug generation:');
console.log(
  'AWS Certified Solutions Architect - Associate ->',
  createSlug('AWS Certified Solutions Architect - Associate'),
);
console.log('Microsoft Azure Fundamentals ->', createSlug('Microsoft Azure Fundamentals'));
console.log(
  'Google Cloud Professional Cloud Architect ->',
  createSlug('Google Cloud Professional Cloud Architect'),
);
console.log('CompTIA Security+ ->', createSlug('CompTIA Security+'));
