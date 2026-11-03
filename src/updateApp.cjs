const fs = require('fs');

let content = fs.readFileSync('App.tsx', 'utf8');

// Add imports if not present
if (!content.includes('DOMAIN_RESOURCES')) {
  const importStatement = "import { DOMAIN_RESOURCES } from './data/domainResources';\nimport DomainResourcesList from './components/shared/DomainResourcesList';\n";
  
  // Find the last import and add there
  const lastImportIndex = content.lastIndexOf('import ');
  const endOfLastImport = content.indexOf('\n', lastImportIndex);
  content = content.slice(0, endOfLastImport + 1) + importStatement + content.slice(endOfLastImport + 1);
}

// Replace <DomainDashboard ... /> with <DomainDashboard ...> <DomainResourcesList /> </DomainDashboard>
// Since DomainDashboard has no children previously, it always ends with "/>"
// We need to capture from "<DomainDashboard" until "/>"

const regex = /(<DomainDashboard[\s\S]*?)(\s*\/>)/g;
content = content.replace(regex, (match, p1) => {
  return `${p1}>\n            <DomainResourcesList resources={DOMAIN_RESOURCES[activeDomain] || []} accent={DOMAIN_ACCENT[activeDomain]} />\n          </DomainDashboard>`;
});

fs.writeFileSync('App.tsx', content);
console.log("Updated App.tsx successfully.");
