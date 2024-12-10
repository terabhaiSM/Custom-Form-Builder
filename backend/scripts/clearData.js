const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearData() {
  try {
    // First, delete the submissions to avoid foreign key violations
    console.log('Deleting data from Submission...');
    await prisma.submission.deleteMany({});

    // Then, delete the fields that belong to the forms
    console.log('Deleting data from Field...');
    await prisma.field.deleteMany({});

    // Finally, delete the forms
    console.log('Deleting data from Form...');
    await prisma.form.deleteMany({});

    console.log('All data cleared successfully!');
  } catch (error) {
    console.error('Error clearing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
clearData();