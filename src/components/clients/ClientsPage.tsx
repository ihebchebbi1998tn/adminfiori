import React, { useState, useEffect } from 'react';

interface Client {
  email: string;
  id_customer: string;
  lastname: string;
  firstname: string;
  address1: string;
  address2: string;
  postcode: string;
  city: string;
  other: string;
  phone: string;
  phone_mobile: string;
}

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [clientsPerPage] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch data from API
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://fioriforyou.com/apis/get_old_info.php');
        const data = await response.json();
        if (data.success) {
          setClients(data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Filter clients based on search query
  const filteredClients = clients.filter((client) =>
    `${client.firstname} ${client.lastname}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Paginate clients
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#5a0c1a] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Client List</h1>
        <input
          type="text"
          placeholder="Search clients..."
          className="p-3 border border-[#5a0c1a] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5a0c1a] focus:border-[#5a0c1a] w-1/4"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full table-auto">
          <thead className="bg-[#5a0c1a] text-white">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Phone</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Address</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">City</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.map((client) => (
              <tr key={client.id_customer} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4 text-sm">{client.id_customer}</td>
                <td className="px-6 py-4 text-sm">{client.firstname} {client.lastname}</td>
                <td className="px-6 py-4 text-sm">{client.email}</td>
                <td className="px-6 py-4 text-sm">{client.phone}</td>
                <td className="px-6 py-4 text-sm">{client.address1} {client.address2}</td>
                <td className="px-6 py-4 text-sm">{client.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-2 py-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          className="px-4 py-2 bg-[#5a0c1a] text-white rounded-md disabled:opacity-50 transition duration-300 ease-in-out hover:bg-[#8b2c2a]"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="text-lg text-gray-700">
          Page {currentPage} of {Math.ceil(filteredClients.length / clientsPerPage)}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          className="px-4 py-2 bg-[#5a0c1a] text-white rounded-md disabled:opacity-50 transition duration-300 ease-in-out hover:bg-[#8b2c2a]"
          disabled={currentPage === Math.ceil(filteredClients.length / clientsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ClientsPage;
