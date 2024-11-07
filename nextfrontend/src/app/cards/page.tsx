"use client"

import { Card, CardContent } from "@/components/ui/card"
import useTaskStore from '../tasks'
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel"
import { useEffect, useState } from 'react';

interface TaskCardProps {
  title: string
  subtitle: string
  description: string
}

const TaskCard = ({ title, subtitle, description }: TaskCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-sm text-foreground">
          {title}
        </h3>
        {subtitle && (
          <Badge variant="secondary" className="font-medium">
            {subtitle}
          </Badge>
        )}
        <div className="relative">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Card className="absolute z-10 p-3 w-[280px] -top-2 left-1/2 -translate-x-1/2 shadow-xl">
              <p className="text-sm text-foreground">{description}</p>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const Column = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex-1">
    <div className="bg-muted/50 rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-muted-foreground text-sm tracking-tight">
          {title}
        </h2>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  </div>
)

export default function TaskBoard() {
  const { epics, tasks } = useTaskStore()
  const [isMd, setIsMd] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMd(window.innerWidth >= 768) // Assuming 'md' breakpoint is 768px
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Call on mount to set initial state

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex-1 overflow-hidden p-6">
      <div className="flex gap-6 h-full overflow-x-auto pb-4">
        {!isMd ? ( // Conditional rendering based on screen size
          <Carousel className="md:flex md:gap-6 md:basis-full">
            <CarouselContent>
              <CarouselItem>
                <Column title="PENDING">
                  {tasks.map((task, index) => (
                    <TaskCard
                      key={index}
                      title={task.title}
                      subtitle={epics.find(epic => epic.id === task.epic)?.title || ""}
                      description={task.description}
                    />
                  ))}
                </Column>
              </CarouselItem>
              <CarouselItem>
                <Column title="IN PROGRESS">
                  {tasks.map((task, index) => (
                    <TaskCard
                      key={index}
                      title={task.title}
                      subtitle={epics.find(epic => epic.id === task.epic)?.title || ""}
                      description={task.description}
                    />
                  ))}
                </Column>
              </CarouselItem>
              <CarouselItem>
                <Column title="COMPLETED">
                  <div>COMPLETED</div>
                </Column>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="fixed left-2 top-1/2 -translate-y-1/2" />
            <CarouselNext className="fixed right-2 top-1/2 -translate-y-1/2" />
          </Carousel>
        ) : (
          <div className="flex flex-row gap-4">
            <Column title="PENDING">
              {tasks.map((task, index) => (
                <TaskCard
                  key={index}
                  title={task.title}
                  subtitle={epics.find(epic => epic.id === task.epic)?.title || ""}
                  description={task.description}
                />
              ))}
            </Column>
            <Column title="IN PROGRESS">
              {tasks.map((task, index) => (
                <TaskCard
                  key={index}
                  title={task.title}
                  subtitle={epics.find(epic => epic.id === task.epic)?.title || ""}
                  description={task.description}
                />
              ))}
            </Column>
            <Column title="COMPLETED">
              <div>COMPLETED</div>
            </Column>
          </div>
        )}
      </div>
    </div>
  )
}