import React from 'react'
import { motion, useInView } from 'motion/react'
import type { Case } from '~/types'
import { cn } from '~/lib/utils'
import PolaroidCard from './PolaroidCard'
import CaseGalleryModal from './CaseGalleryModal'

interface Props {
  cases: Case[]
  title: string
  description?: string
  className?: string
}

// 生成随机旋转角度
const generateRotations = (count: number) => Array.from({ length: count }, () => Math.random() * 20 - 10)

const PolaroidStack: React.FC<Props> = ({ cases, title, description, className }) => {
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.4 })
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [shouldRenderModal, setShouldRenderModal] = React.useState(false)
  const [selectedCaseIndex, setSelectedCaseIndex] = React.useState(0)
  const [clickedCaseIndex, setClickedCaseIndex] = React.useState<number | null>(null)
  const openTimerRef = React.useRef<number | null>(null)
  const closeTimerRef = React.useRef<number | null>(null)

  // Generate a stable rotation for each card in the stack.
  const caseRotations = React.useMemo(() => generateRotations(cases.length), [cases.length])

  const handleCaseClick = (index: number) => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }

    setShouldRenderModal(true)
    setClickedCaseIndex(index)
    setSelectedCaseIndex(index)

    openTimerRef.current = window.setTimeout(() => {
      setIsModalOpen(true)
      openTimerRef.current = null
    }, 50)
  }

  const handleModalClose = () => {
    if (openTimerRef.current) {
      window.clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }

    setIsModalOpen(false)

    closeTimerRef.current = window.setTimeout(() => {
      setClickedCaseIndex(null)
      setShouldRenderModal(false)
      closeTimerRef.current = null
    }, 200)
  }

  React.useEffect(() => {
    return () => {
      if (openTimerRef.current) {
        window.clearTimeout(openTimerRef.current)
      }

      if (closeTimerRef.current) {
        window.clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  return (
    <>
      <motion.div ref={ref} className={cn('relative perspective-1000 ml-4 flex flex-wrap items-center ', className)}>
        {cases.map((caseItem, index) => (
          <div key={typeof caseItem.src === 'string' ? caseItem.src : caseItem.src.src} onClick={() => handleCaseClick(index)}>
            <PolaroidCard
              caseItem={caseItem}
              index={index}
              totalCases={cases.length}
              rotation={caseRotations[index]}
              variant={caseItem.variant}
              isVisible={isInView}
              isClicked={clickedCaseIndex === index}
            />
          </div>
        ))}
      </motion.div>

      {shouldRenderModal && (
        <CaseGalleryModal
          cases={cases}
          title={title}
          description={description}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          initialIndex={selectedCaseIndex}
        />
      )}
    </>
  )
}

export default PolaroidStack
