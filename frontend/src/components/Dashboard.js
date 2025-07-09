import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [loads, setLoads] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    api.getLoads().then(setLoads);
    api.getDrivers().then(setDrivers);
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Loads</h2>
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="p-2 border">Load ID</th>
              <th className="p-2 border">Pickup</th>
              <th className="p-2 border">Delivery</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {loads.map(load => (
              <tr key={load._id}>
                <td className="p-2 border">{load.loadId}</td>
                <td className="p-2 border">{load.pickupLocation}</td>
                <td className="p-2 border">{load.deliveryLocation}</td>
                <td className="p-2 border">{load.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Drivers</h2>
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">License #</th>
              <th className="p-2 border">Email</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map(driver => (
              <tr key={driver._id}>
                <td className="p-2 border">{driver.name}</td>
                <td className="p-2 border">{driver.licenseNumber}</td>
                <td className="p-2 border">{driver.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
