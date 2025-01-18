import React, { useState, useEffect } from 'react';

interface Email {
  id: string;
  email: string;
}

const NewsLetter: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch emails from the API
  useEffect(() => {
    const fetchEmails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://www.fioriforyou.com/backfiori/get_emails.php');
        const data = await response.json();
        if (data.status === 'success') {
          setEmails(data.data);
        }
      } catch (error) {
        console.error('Error fetching emails:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmails();
  }, []);

  // Handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filter emails based on search query
  const filteredEmails = emails.filter((email) =>
    email.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Rechercher des e-mails..."
          className="p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-1/3"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-[#5a0c1a] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmails.map((email) => (
              <tr key={email.id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4 text-sm">{email.id}</td>
                <td className="px-6 py-4 text-sm">{email.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredEmails.length === 0 && (
        <div className="text-center text-gray-500 py-6">
      Aucun email trouvé.
        </div>
      )}
    </div>
  );
};

export default NewsLetter;
