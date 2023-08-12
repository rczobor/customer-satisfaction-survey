import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Spinner from "@/src/components/spinner";
import { trpc } from "@/src/utils/trpc";
import { useRouter } from "next/router";

export default function Question() {
  const router = useRouter();
  const questionId = router.query.id as string;
  const { data } = trpc.record.getAllForQuestion.useQuery({
    questionId,
  });

  if (!data) {
    return <Spinner />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Dátum</TableHead>
          <TableHead>Válasz</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{record.createdAt.toLocaleDateString()}</TableCell>
            <TableCell>
              {record.question.isInput ? record.text : record.answer?.text}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
