# DocGen

**The Open Source Alternative to PDF Generator API and Document Generation SaaS**

DocGen is a powerful, self-hosted document generation platform that puts you in control of your document workflows. Built with modern web technologies, it offers a rich editing experience with dynamic field management - perfect for generating invoices, contracts, reports, and any document that requires data merging.

## Why Choose DocGen?

### 🆓 **Cost-Effective**

- **Zero subscription fees** - No monthly charges like PDFShift ($29/mo), DocRaptor ($15/mo), or PDF Generator API ($19/mo)
- **No usage limits** - Generate unlimited documents without per-document charges
- **Self-hosted** - Complete control over your infrastructure costs

## Features

### 📝 **Advanced Document Editor**

- Full-featured WYSIWYG editor with formatting, tables, images
- Import existing DOCX files and convert to editable templates
- Auto-save functionality to prevent data loss
- Dark/light theme support

### 🎯 **Developer-Friendly**

- **Modern tech stack** - Next.js 16, React 19, TypeScript, Prisma
- **API-first design** - tRPC for type-safe API calls
- **Database agnostic** - Works with PostgreSQL, MySQL, SQLite
- **Easy deployment** - Docker support, Vercel-ready

## Quick Start

### Prerequisites

- Node.js 18+ or Bun
- PostgreSQL database (or modify for your preferred DB)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/docgen.git
   cd docgen
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or npm install
   ```

3. **Set up environment**

   ```bash
   cp .env.example .env
   # Edit .env with your database URL
   ```

4. **Initialize database**

   ```bash
   bun run db:push
   ```

5. **Start development server**

   ```bash
   bun run dev
   ```

Visit `http://localhost:3000` to start creating documents!

## Usage

### Creating Your First Document

1. **Access the editor** at `/dashboard/editor`
2. **Add dynamic fields** using the sidebar - click "Add New Field"
3. **Insert fields** into your document by clicking them in the sidebar
4. **Import existing documents** using the "Import DOCX" button
5. **Organize fields** by categories (customer, invoice, product, etc.)

### Field Types Supported

- **Text** - Names, descriptions, addresses
- **Numbers** - Prices, quantities, totals  
- **Email** - Contact information
- **Phone** - Phone numbers with formatting
- **Date** - Dates with proper formatting
- **Image** - Logos, signatures, photos
- **URL** - Links and references


## Deployment
### Self-Hosted

```bash
# Build for production
bun run build
bun run start
```

## Comparison with SaaS Alternatives

| Feature | DocGen | PDF Generator API | PDFShift | DocRaptor |
|---------|--------|------------------|----------|-----------|
| **Cost** | Free (self-hosted) | $19+/month | $29+/month | $15+/month |
| **Document Limits** | Unlimited | 1,000-10,000/mo | 250-2,500/mo | 125-1,250/mo |
| **Data Privacy** | ✅ Your servers | ❌ Third-party | ❌ Third-party | ❌ Third-party |
| **Customization** | ✅ Full control | ❌ Limited | ❌ Limited | ❌ Limited |
| **WYSIWYG Editor** | ✅ Built-in | ❌ Code only | ❌ Code only | ❌ Code only |
| **Field Management** | ✅ Visual UI | ❌ Manual coding | ❌ Manual coding | ❌ Manual coding |
| **DOCX Import** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Open Source** | ✅ MIT License | ❌ Proprietary | ❌ Proprietary | ❌ Proprietary |

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Editor**: TinyMCE with custom plugins
- **Backend**: tRPC, Prisma ORM
- **Database**: PostgreSQL (configurable)
- **Document Processing**: Mammoth.js for DOCX import
- **State Management**: Zustand
- **Authentication**: Ready for NextAuth.js integration


### Development Setup

```bash
# Install dependencies
bun install

# Start database (if using Docker)
./start-database.sh

# Run database migrations
bun run db:push

# Start development server
bun run dev

# Run type checking
bun run typecheck

# Format code
bun run format:write
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [Coming Soon]
- **Issues**: [GitHub Issues](https://github.com/0xSourceHub/DocGen/issues)
- **Discord**: [Discord Server](https://discord.gg/VgAEy94s)
- **Email**: <aziz.souabnii@gmail.com>

---

**Stop paying monthly fees for document generation. Take control with DocGen.**
