"use client"

import { Icon } from "@/components/Icon"
import { StyledText } from "@/components/StyledText"
import { Toast } from "@/components/Toasts"
import uniqueId from "lodash/uniqueId"
import { FormEvent, useEffect, useRef, useState } from "react"
import { twJoin } from "tailwind-merge"
import { useLocalStorage } from "usehooks-ts"

export type Tweak = {
  id: string
  json: object
  label: string
  disabled?: boolean
}

export function BackendDataTweaker() {
  const [tweaks, setTweaks] = useLocalStorage<Tweak[]>("backendDataTweaks", [])
  const [isOpen, setIsOpen] = useState(false)
  const [editingTweakId, setEditingTweakId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const formElementRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const formElement = formElementRef.current

    if (!formElement) {
      return
    }

    if (editingTweakId !== null) {
      const tweak = tweaks.find((t) => t.id === editingTweakId)

      if (tweak) {
        const labelInput = formElement.querySelector(
          "input[name='label']"
        ) as HTMLInputElement
        const jsonInput = formElement.querySelector(
          "textarea[name='json']"
        ) as HTMLTextAreaElement

        if (labelInput && jsonInput) {
          labelInput.value = tweak.label
          jsonInput.value = JSON.stringify(tweak.json, null, 2)
        }
      }
    }
  }, [editingTweakId])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()

    const formElement = formElementRef.current

    if (!formElement) {
      return
    }

    const formData = new FormData(formElement)
    const label = formData.get("label")
    const json = formData.get("json")

    if (!label || !json) {
      setError("Please enter a label and some JSON")
      return
    }

    try {
      const parsedTweak = JSON.parse(String(json))

      if (editingTweakId !== null) {
        setTweaks((prev) =>
          prev.map((t) =>
            t.id === editingTweakId
              ? { ...t, json: parsedTweak, label: String(label) }
              : t
          )
        )
      } else {
        setTweaks((prev) => [
          ...prev,
          { id: uniqueId(), json: parsedTweak, label: String(label) },
        ])
      }

      setEditingTweakId(null)
      setError("")
      formElement.reset()
    } catch (e) {
      setError("Invalid JSON")
    }
  }

  function handleClickToggleDisabled(id: string) {
    setTweaks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, disabled: !t.disabled } : t))
    )
  }

  function handleClickEditTweak(id: string) {
    setEditingTweakId(id)
  }

  function handleClickDeleteTweak(id: string) {
    if (!confirm("Are you sure you want to delete this tweak?")) return
    setTweaks((prev) => prev.filter((t) => t.id !== id))
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-md bg-gray-800 p-2 text-white"
      >
        Tweak State
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={twJoin(
        "w-96 p-4",
        "fixed bottom-4 right-4",
        "flex flex-col gap-3",
        "rounded-lg",
        "bg-black/75 backdrop-blur-sm",
        "shadow-lg"
      )}
      ref={formElementRef}
    >
      <div className="flex items-center justify-between">
        <StyledText variant="h4">Backend Data Tweaks</StyledText>
        <StyledText variant="link" onClick={() => setIsOpen(false)}>
          <Icon name="xmark" />
        </StyledText>
      </div>

      {error && <Toast variant="error">{error}</Toast>}

      <StyledText
        variant="input.text"
        as="input"
        type="text"
        name="label"
        placeholder="Label"
        className="w-full font-mono text-xs"
      />

      <StyledText
        variant="input.text"
        as="textarea"
        name="json"
        placeholder="Enter some JSON (sorry, it's strict)"
        className="h-40 w-full font-mono text-xs"
        spellCheck="false"
      />

      <div className="flex flex-row-reverse justify-between text-xs">
        <div className="flex flex-row-reverse items-center gap-3">
          <StyledText as="button" type="submit" variant="button.primary.small">
            {editingTweakId !== null ? "Update Tweak" : "Save New Tweak"}
          </StyledText>
          {editingTweakId !== null && (
            <StyledText
              variant="link"
              onClick={() => {
                setEditingTweakId(null)
                setError("")
                formElementRef.current?.reset()
              }}
            >
              Cancel
            </StyledText>
          )}
        </div>

        <StyledText
          as="button"
          variant="link"
          onClick={() =>
            confirm("Are you sure you want to clear all tweaks?") &&
            setTweaks([])
          }
        >
          Clear All Tweaks
        </StyledText>
      </div>

      {tweaks.length > 0 && (
        <div className="flex flex-col gap-3">
          {tweaks.map((tweak) => {
            const { id, label, json, disabled } = tweak

            return (
              <div key={id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <StyledText variant="label">{label}</StyledText>
                  <div className="flex flex-row-reverse items-center gap-2">
                    <StyledText
                      variant="link"
                      onClick={handleClickToggleDisabled.bind(null, id)}
                    >
                      <Icon
                        name={disabled ? "toggle-large-off" : "toggle-large-on"}
                      />
                    </StyledText>

                    <StyledText
                      variant="link"
                      onClick={handleClickEditTweak.bind(null, id)}
                    >
                      <Icon name="pencil" />
                    </StyledText>

                    <StyledText
                      variant="link"
                      onClick={handleClickDeleteTweak.bind(null, id)}
                    >
                      <Icon name="trash" />
                    </StyledText>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </form>
  )
}
