import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Claim {
  subLtr: string;
  occurrenceId: string;
  procAIM: string;
  eventDate: string;
  madeDate: string;
  reportDate: string;
  closeDate: string;
  reopenDate: string;
  state: string;
  description: string;
  claimant: string;
  status: string;
  grossPaidLoss: number;
  grossPaidExpense: number;
  grossOutstanding: number;
  grossIncurredLoss: number;
}

const ClaimsHistory: React.FC = () => {
  const claims: Claim[] = [
    {
      subLtr: "A",
      occurrenceId: "1001",
      procAIM: "FIRE",
      eventDate: "01/15/2022",
      madeDate: "01/16/2022",
      reportDate: "01/17/2022",
      closeDate: "03/01/2022",
      reopenDate: "N/A",
      state: "NY",
      description: "Fire damage to server room due to faulty wiring.",
      claimant: "Empire Tech Tower, Inc.",
      status: "Closed",
      grossPaidLoss: 750000,
      grossPaidExpense: 50000,
      grossOutstanding: 0,
      grossIncurredLoss: 800000,
    },
    {
      subLtr: "B",
      occurrenceId: "1002",
      procAIM: "WATER",
      eventDate: "09/10/2021",
      madeDate: "09/12/2021",
      reportDate: "09/13/2021",
      closeDate: "11/15/2021",
      reopenDate: "02/01/2022",
      state: "NY",
      description: "Water damage from burst pipe affecting multiple floors.",
      claimant: "Empire Tech Tower, Inc.",
      status: "Reopened",
      grossPaidLoss: 1200000,
      grossPaidExpense: 100000,
      grossOutstanding: 200000,
      grossIncurredLoss: 1500000,
    },
    {
      subLtr: "C",
      occurrenceId: "1003",
      procAIM: "THEFT",
      eventDate: "03/05/2020",
      madeDate: "03/06/2020",
      reportDate: "03/07/2020",
      closeDate: "04/10/2020",
      reopenDate: "N/A",
      state: "NY",
      description: "Theft of high-value tech equipment from secure room.",
      claimant: "Empire Tech Tower, Inc.",
      status: "Closed",
      grossPaidLoss: 500000,
      grossPaidExpense: 30000,
      grossOutstanding: 0,
      grossIncurredLoss: 530000,
    },
    {
      subLtr: "D",
      occurrenceId: "1004",
      procAIM: "WIND",
      eventDate: "11/20/2019",
      madeDate: "11/22/2019",
      reportDate: "11/23/2019",
      closeDate: "01/05/2020",
      reopenDate: "N/A",
      state: "NY",
      description: "Windstorm causing structural damage to the facade.",
      claimant: "Empire Tech Tower, Inc.",
      status: "Closed",
      grossPaidLoss: 900000,
      grossPaidExpense: 75000,
      grossOutstanding: 0,
      grossIncurredLoss: 975000,
    },
    {
      subLtr: "E",
      occurrenceId: "1005",
      procAIM: "SLIP",
      eventDate: "07/14/2021",
      madeDate: "07/15/2021",
      reportDate: "07/16/2021",
      closeDate: "08/10/2021",
      reopenDate: "N/A",
      state: "NY",
      description: "Slip and fall incident in the lobby area.",
      claimant: "Empire Tech Tower, Inc.",
      status: "Closed",
      grossPaidLoss: 100000,
      grossPaidExpense: 10000,
      grossOutstanding: 0,
      grossIncurredLoss: 110000,
    },
    {
      subLtr: "F",
      occurrenceId: "1006",
      procAIM: "EXPLOSION",
      eventDate: "06/25/2022",
      madeDate: "06/26/2022",
      reportDate: "06/27/2022",
      closeDate: "10/01/2022",
      reopenDate: "N/A",
      state: "NY",
      description:
        "Explosion in a backup generator causing extensive damage to the mechanical room and nearby areas.",
      claimant: "Empire Tech Tower, Inc.",
      status: "Closed",
      grossPaidLoss: 2500000,
      grossPaidExpense: 200000,
      grossOutstanding: 0,
      grossIncurredLoss: 2700000,
    },
    {
      subLtr: "G",
      occurrenceId: "1007",
      procAIM: "FLOOD",
      eventDate: "08/15/2020",
      madeDate: "08/16/2020",
      reportDate: "08/17/2020",
      closeDate: "12/20/2020",
      reopenDate: "03/01/2021",
      state: "NY",
      description:
        "Major flooding from a nearby river affecting the lower levels and electrical systems.",
      claimant: "Empire Tech Tower, Inc.",
      status: "Reopened",
      grossPaidLoss: 3800000,
      grossPaidExpense: 300000,
      grossOutstanding: 500000,
      grossIncurredLoss: 4600000,
    },
    {
      subLtr: "H",
      occurrenceId: "1008",
      procAIM: "MOLD",
      eventDate: "02/10/2021",
      madeDate: "02/12/2021",
      reportDate: "02/13/2021",
      closeDate: "04/15/2021",
      reopenDate: "09/05/2021",
      state: "NY",
      description:
        "Extensive mold growth discovered in HVAC system requiring complete system overhaul and remediation.",
      claimant: "Empire Tech Tower, Inc.",
      status: "Reopened",
      grossPaidLoss: 1750000,
      grossPaidExpense: 150000,
      grossOutstanding: 350000,
      grossIncurredLoss: 2250000,
    },
  ];

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "closed":
        return "bg-green-500";
      case "reopened":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg">
      <CardHeader className="bg-red-600 text-white">
        <h2 className="text-2xl font-semibold">Claims History</h2>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-300">Sub Ltr</TableHead>
              <TableHead className="text-gray-300">ID</TableHead>
              <TableHead className="text-gray-300">Proc AIM</TableHead>
              <TableHead className="text-gray-300">Event Date</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Description</TableHead>
              <TableHead className="text-gray-300">Gross Paid Loss</TableHead>
              <TableHead className="text-gray-300">
                Gross Paid Expense
              </TableHead>
              <TableHead className="text-gray-300">Gross Outstanding</TableHead>
              <TableHead className="text-gray-300">
                Gross Incurred Loss
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims.map((claim) => (
              <TableRow key={claim.occurrenceId} className="hover:bg-gray-700">
                <TableCell className="font-medium text-gray-300">
                  {claim.subLtr}
                </TableCell>
                <TableCell className="text-gray-300">
                  {claim.occurrenceId}
                </TableCell>
                <TableCell className="text-gray-300">{claim.procAIM}</TableCell>
                <TableCell className="text-gray-300">
                  {claim.eventDate}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusColor(claim.status)} text-white`}
                  >
                    {claim.status}
                  </Badge>
                </TableCell>
                <TableCell
                  className="text-gray-300 max-w-xs truncate"
                  title={claim.description}
                >
                  {claim.description}
                </TableCell>
                <TableCell className="text-gray-300">
                  {formatCurrency(claim.grossPaidLoss)}
                </TableCell>
                <TableCell className="text-gray-300">
                  {formatCurrency(claim.grossPaidExpense)}
                </TableCell>
                <TableCell className="text-gray-300">
                  {formatCurrency(claim.grossOutstanding)}
                </TableCell>
                <TableCell className="text-gray-300">
                  {formatCurrency(claim.grossIncurredLoss)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ClaimsHistory;
