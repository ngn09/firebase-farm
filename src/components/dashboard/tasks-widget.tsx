import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const tasks = [
    { id: 1, title: "Kuzey Tarlasını Gübrele", status: "Bekliyor" },
    { id: 2, title: "Sulama sistemini onar", status: "Devam Ediyor" },
    { id: 3, title: "B Tarlasına mısır ek", status: "Bekliyor" },
    { id: 4, title: "Yeni tohum sipariş et", status: "Tamamlandı" },
];

export function TasksWidget() {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <CardTitle>Yaklaşan Görevler</CardTitle>
                <CardDescription>Yapılacaklar listenize hızlı bir bakış.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <ul className="space-y-4">
                    {tasks.filter(t => t.status !== 'Tamamlandı').slice(0, 3).map(task => (
                        <li key={task.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Checkbox id={`task-widget-${task.id}`} />
                                <label htmlFor={`task-widget-${task.id}`} className="text-sm font-medium">{task.title}</label>
                            </div>
                            <Badge variant={task.status === 'Bekliyor' ? 'secondary' : 'default'}>
                                {task.status}
                            </Badge>
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/tasks">Tüm Görevleri Yönet</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
