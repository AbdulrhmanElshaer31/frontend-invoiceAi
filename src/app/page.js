import { Table } from "@/componants/ui/table";
import { Th } from "@/componants/ui/th";
import { TableHead } from "@/componants/ui/tHead";
import { Tr } from "@/componants/ui/tr";
import { Td } from "@/componants/ui/td";
import Select from "@/componants/ui/select";
export default function Landing() {
  return (
    <>
    <div className="w-full h-screen flex items-center justify-center">
     <Select>
  <option value="">Choose cost center</option>
  <option value="1">Marketing</option>
  <option value="2">Sales</option>
</Select>

    </div>
    </>
  );
}
